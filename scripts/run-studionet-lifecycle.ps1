param(
  [string]$PrideAddress = '0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9',
  [string]$GateAddress = '0x5cEeD74e1465da8D962C1DAe98903F72089E0A18',
  [string]$IssuerAccount = 'pride-v1-throwaway',
  [string]$ChallengerAccount = 'pride-v1-challenger-20261020',
  [string]$FixtureCommit = '9ab1a76c784b525671bc5bc3f9873b8bf581a23e'
)

$ErrorActionPreference = 'Stop'
$rpc = 'https://studio.genlayer.com/api'
$repo = 'BeatyXO/pride'
$base = "https://raw.githubusercontent.com/$repo/$FixtureCommit/tests/fixtures/commitments"
$baseline = "$base/baseline.txt"
$changed = "$base/changed.txt"
$amended = "$base/amended.txt"
$notice = "$base/notice.txt"
$rebuttal = "$base/rebuttal.txt"
$transactions = [System.Collections.Generic.List[object]]::new()

function Invoke-GenLayer([string[]]$Arguments) {
  $output = (& genlayer @Arguments 2>&1 | Out-String)
  if ($LASTEXITCODE -ne 0) { throw "GenLayer CLI failed: $($Arguments -join ' ')`n$($output.Substring(0, [Math]::Min(500, $output.Length)))" }
  return $output
}

function Set-Account([string]$Name) {
  $null = Invoke-GenLayer @('account', 'use', $Name)
  $details = Invoke-GenLayer @('account', 'show', '--rpc', $rpc, '--account', $Name)
  $addressMatch = [regex]::Match($details, "address: '?(0x[a-fA-F0-9]{40})'?")
  $balanceMatch = [regex]::Match($details, "balance: '([^']+)'")
  $statusMatch = [regex]::Match($details, "status: '([^']+)'")
  if (-not $addressMatch.Success -or $statusMatch.Groups[1].Value -ne 'unlocked') {
    throw "Account $Name is not available and unlocked."
  }
  return [pscustomobject]@{ name = $Name; address = $addressMatch.Groups[1].Value; balance = $balanceMatch.Groups[1].Value }
}

function Submit-Write([string]$Label, [string]$Address, [string]$Method, [string[]]$CallArgs = @()) {
  $cliArgs = @('write', $Address, $Method, '--rpc', $rpc)
  if ($CallArgs.Count -gt 0) { $cliArgs += @('--args') + $CallArgs }
  $writeOutput = Invoke-GenLayer $cliArgs
  $hashMatch = [regex]::Match($writeOutput, 'Write Transaction Hash:\s*(0x[a-fA-F0-9]{64})')
  if (-not $hashMatch.Success) { throw "No transaction hash returned for $Label." }
  $hash = $hashMatch.Groups[1].Value
  $receipt = Invoke-GenLayer @('receipt', $hash, '--rpc', $rpc, '--interval', '1000', '--retries', '180')
  $status = [regex]::Match($receipt, "status_name: '([^']+)'").Groups[1].Value
  $consensus = [regex]::Match($receipt, "result_name: '([^']+)'").Groups[1].Value
  $execution = [regex]::Match($receipt, "leader_receipt: \[\s*\{\s*execution_result: '([^']+)'").Groups[1].Value
  $record = [pscustomobject]@{ label = $Label; transactionHash = $hash; status = $status; consensus = $consensus; leaderExecution = $execution }
  $transactions.Add($record)
  if ($status -ne 'FINALIZED' -or $consensus -ne 'MAJORITY_AGREE' -or $execution -ne 'SUCCESS') {
    throw "Transaction $Label did not finalize successfully: $($record | ConvertTo-Json -Compress)"
  }
  return $hash
}

function Read-View([string]$Address, [string]$Method, [string[]]$CallArgs = @()) {
  $cliArgs = @('call', $Address, $Method, '--rpc', $rpc)
  if ($CallArgs.Count -gt 0) { $cliArgs += @('--args') + $CallArgs }
  $output = Invoke-GenLayer $cliArgs
  $resultMatch = [regex]::Match($output, '(?s)Result:\s*(.*?)(?:\r?\n\r?\n√ Read operation successfully executed)')
  if (-not $resultMatch.Success) { throw "No result body returned by $Method." }
  return ConvertFrom-Json -InputObject $resultMatch.Groups[1].Value -AsHashtable
}

function Assert-Equal($Actual, $Expected, [string]$Message) {
  if ($Actual -cne $Expected) { throw "$Message Expected '$Expected', got '$Actual'." }
}

# Confirm the pinned source inputs are live before sending contract transactions.
foreach ($url in @($baseline, $changed, $amended, $notice, $rebuttal)) {
  $response = Invoke-WebRequest -Uri $url -Method Get
  if ($response.StatusCode -ne 200) { throw "Lifecycle evidence URL is unavailable: $url" }
}

$issuer = Set-Account $IssuerAccount
$publishers = @(Read-View $PrideAddress 'get_publishers' @('0', '10'))
if ($publishers.Count -eq 0) {
  $null = Submit-Write 'register_publisher' $PrideAddress 'register_publisher' @('PRIDE V1 Release Test', $repo)
  $publishers = @(Read-View $PrideAddress 'get_publishers' @('0', '10'))
}
if ($publishers.Count -ne 1 -or $publishers[0].owner -ine $issuer.address -or $publishers[0].active -ne $true) {
  throw 'Publisher state is not the expected active issuer binding.'
}

$charters = @(Read-View $PrideAddress 'get_charters' @('0', '10'))
if ($charters.Count -ne 0) { throw 'Expected a fresh Pride deployment with no charters.' }
$null = Submit-Write 'register_charter' $PrideAddress 'register' @(
  'Community Allocation Test', 'TOKENOMICS', $baseline, 'Community allocation remains 30%.')
$charters = @(Read-View $PrideAddress 'get_charters' @('0', '10'))
if ($charters.Count -ne 1 -or $charters[0].version -ne 1 -or $charters[0].active -ne $true) {
  throw 'Charter registration was not independently read back.'
}

$null = Submit-Write 'baseline_verification' $PrideAddress 'check_source' @('0', $baseline)
$checks = @(Read-View $PrideAddress 'get_checks' @('0', '0', '10'))
Assert-Equal $checks[0].outcome 'MATCHES' 'Baseline verification outcome mismatch.'

$null = Submit-Write 'material_change' $PrideAddress 'check_source' @('0', $changed)
$checks = @(Read-View $PrideAddress 'get_checks' @('0', '0', '10'))
Assert-Equal $checks[1].outcome 'MATERIAL_CHANGE' 'Changed source did not record MATERIAL_CHANGE.'

$null = Submit-Write 'propose_amendment' $PrideAddress 'propose_amendment' @(
  '0', $amended, 'Community allocation is amended to 15%.', $notice)
$amendments = @(Read-View $PrideAddress 'get_amendments' @('0', '0', '10'))
if ($amendments.Count -ne 1 -or $amendments[0].active -ne $false) { throw 'Pending amendment was not read back.' }
$null = Submit-Write 'activate_amendment' $PrideAddress 'activate_amendment' @('0')
$charters = @(Read-View $PrideAddress 'get_charters' @('0', '10'))
if ($charters[0].version -ne 2 -or $charters[0].promise -ne 'Community allocation is amended to 15%.') {
  throw 'Amended version 2 was not read back.'
}

$null = Submit-Write 'amended_version_verification' $PrideAddress 'check_source' @('0', $amended)
$checks = @(Read-View $PrideAddress 'get_checks' @('0', '0', '10'))
Assert-Equal $checks[2].outcome 'MATCHES' 'Amended version did not verify as MATCHES.'
$reliance = Read-View $PrideAddress 'get_reliance_status' @('0')
if ($reliance.eligible -ne $true -or $reliance.checkpoint_id -ne $checks[2].id -or
    $reliance.checkpoint_outcome -ne 'MATCHES' -or $reliance.source_matches -ne $true -or
    $reliance.content_matches -ne $true -or @($reliance.blocking_cases).Count -ne 0) {
  throw "Pride did not expose the expected fail-closed positive status: $($reliance | ConvertTo-Json -Compress)"
}

$null = Submit-Write 'gate_permitted_current_match' $GateAddress 'authorize' @('pride-v1-current-match')
$decisions = @(Read-View $GateAddress 'get_decisions' @('0', '10'))
if ($decisions.Count -ne 1 -or $decisions[0].permitted -ne $true -or
    $decisions[0].checkpoint_outcome -ne 'MATCHES') { throw 'Gate PERMITTED decision was not read back.' }

$challenger = Set-Account $ChallengerAccount
$decisionsBeforeUnauthorized = @(Read-View $GateAddress 'get_decisions' @('0', '10'))
$null = Submit-Write 'unauthorized_gate_operator_rejected' $GateAddress 'authorize' @('unauthorized-caller-probe')
$decisionsAfterUnauthorized = @(Read-View $GateAddress 'get_decisions' @('0', '10'))
if ($decisionsAfterUnauthorized.Count -ne $decisionsBeforeUnauthorized.Count) {
  throw 'Unauthorized Gate call changed the decision list.'
}

$null = Submit-Write 'open_evidence_challenge' $PrideAddress 'open_challenge' @(
  '0', '1', $changed, 'Community allocation is now 15%.')
$cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
if ($cases.Count -ne 1 -or $cases[0].status -ne 'OPEN' -or $cases[0].checkpoint_id -ne 1) {
  throw 'Evidence-backed challenge was not read back as OPEN.'
}

$null = Submit-Write 'unauthorized_rebuttal_rejected' $PrideAddress 'rebut_challenge' @(
  '0', $rebuttal, 'The 15% allocation applies to the community category described in the original commitment.')
$cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
if ($cases[0].status -ne 'OPEN' -or $cases[0].rebuttal_url) {
  throw 'Unauthorized rebuttal changed the challenge state.'
}

$issuer = Set-Account $IssuerAccount
$null = Submit-Write 'authorized_rebuttal' $PrideAddress 'rebut_challenge' @(
  '0', $rebuttal, 'The 15% allocation applies to the community category described in the original commitment.')
$cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
Assert-Equal $cases[0].status 'REBUTTED' 'Authorized issuer rebuttal was not read back.'

$null = Submit-Write 'gate_rejected_while_case_rebutted' $GateAddress 'authorize' @('pride-v1-blocking-case')
$decisions = @(Read-View $GateAddress 'get_decisions' @('0', '10'))
if ($decisions.Count -ne 2 -or $decisions[0].permitted -ne $true -or $decisions[1].permitted -ne $false) {
  throw 'Gate did not record PERMITTED then REJECTED while a rebutted case was unresolved.'
}

$null = Submit-Write 'consensus_case_resolution' $PrideAddress 'adjudicate_challenge' @('0')
$cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
if ($cases[0].status -notin @('UPHELD', 'REJECTED', 'INCONCLUSIVE')) { throw 'Challenge did not reach a terminal resolution.' }
$standing = Read-View $PrideAddress 'get_standing' @('0')

$evidence = [ordered]@{
  network = 'GenLayer Studionet'
  chainId = 61999
  rpcUrl = $rpc
  prideAddress = $PrideAddress
  gateAddress = $GateAddress
  issuerAddress = $issuer.address
  challengerAddress = $challenger.address
  fixtureCommit = $FixtureCommit
  completedAtUtc = [DateTime]::UtcNow.ToString('o')
  transactions = @($transactions)
  finalCharter = $charters[0]
  checkpoints = $checks | ForEach-Object { [ordered]@{ id=$_.id; version=$_.version; outcome=$_.outcome; digest=$_.content_digest; evidence=$_.evidence_excerpt } }
  challenge = $cases[0]
  standing = $standing
  gateDecisions = $decisions
  relianceStatusBeforeChallenge = $reliance
}
$json = $evidence | ConvertTo-Json -Depth 20
[IO.File]::WriteAllText((Join-Path $PSScriptRoot '..\docs\live-lifecycle-v1.json'), $json + "`n", [Text.UTF8Encoding]::new($false))
Write-Output $json
