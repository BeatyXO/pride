param(
  [string]$PrideAddress = '0x1A232b6eb69484B29f9Fc9A0Fa06c927083726e9',
  [string]$GateAddress = '0x5cEeD74e1465da8D962C1DAe98903F72089E0A18',
  [string]$IssuerAccount = 'pride-v1-throwaway',
  [string]$ChallengerAccount = 'pride-v1-challenger-20261020',
  [string]$FixtureCommit = '9ab1a76c784b525671bc5bc3f9873b8bf581a23e'
)

$ErrorActionPreference = 'Stop'
$rpc = 'https://studio.genlayer.com/api'
$base = "https://raw.githubusercontent.com/BeatyXO/pride/$FixtureCommit/tests/fixtures/commitments"
$changed = "$base/changed.txt"
$rebuttal = "$base/rebuttal.txt"
$transactions = [System.Collections.Generic.List[object]]::new()

function Invoke-GenLayer([string[]]$Arguments) {
  $output = (& genlayer @Arguments 2>&1 | Out-String)
  if ($LASTEXITCODE -ne 0) { throw "GenLayer CLI failed: $($Arguments -join ' ')`n$($output.Substring(0, [Math]::Min(700, $output.Length)))" }
  return $output
}

function Set-Account([string]$Name) {
  $null = Invoke-GenLayer @('account', 'use', $Name)
  $details = Invoke-GenLayer @('account', 'show', '--rpc', $rpc, '--account', $Name)
  $addressMatch = [regex]::Match($details, "address: '?(0x[a-fA-F0-9]{40})'?")
  $statusMatch = [regex]::Match($details, "status: '([^']+)'")
  if (-not $addressMatch.Success -or $statusMatch.Groups[1].Value -ne 'unlocked') { throw "Account $Name is not unlocked." }
  return $addressMatch.Groups[1].Value
}

function Submit-Write([string]$Label, [string]$Address, [string]$Method, [string[]]$CallArgs = @()) {
  $cliArgs = @('write', $Address, $Method, '--rpc', $rpc)
  if ($CallArgs.Count -gt 0) { $cliArgs += @('--args') + $CallArgs }
  $writeOutput = Invoke-GenLayer $cliArgs
  $hash = [regex]::Match($writeOutput, 'Write Transaction Hash:\s*(0x[a-fA-F0-9]{64})').Groups[1].Value
  if (-not $hash) { throw "No transaction hash returned for $Label." }
  $receipt = Invoke-GenLayer @('receipt', $hash, '--rpc', $rpc, '--interval', '1000', '--retries', '180')
  $record = [pscustomobject]@{
    label = $Label
    transactionHash = $hash
    status = [regex]::Match($receipt, "status_name: '([^']+)'").Groups[1].Value
    consensus = [regex]::Match($receipt, "result_name: '([^']+)'").Groups[1].Value
    leaderExecution = [regex]::Match($receipt, "leader_receipt: \[\s*\{\s*execution_result: '([^']+)'").Groups[1].Value
  }
  $transactions.Add($record)
  Write-Output ("{0}: {1} status={2} consensus={3} execution={4}" -f $record.label, $record.transactionHash, $record.status, $record.consensus, $record.leaderExecution)
  if ($record.status -ne 'FINALIZED' -or $record.consensus -ne 'MAJORITY_AGREE' -or $record.leaderExecution -ne 'SUCCESS') {
    throw "Transaction did not finalize successfully: $($record | ConvertTo-Json -Compress)"
  }
  return $hash
}

function Read-View([string]$Address, [string]$Method, [string[]]$CallArgs = @()) {
  $cliArgs = @('call', $Address, $Method, '--rpc', $rpc)
  if ($CallArgs.Count -gt 0) { $cliArgs += @('--args') + $CallArgs }
  $output = Invoke-GenLayer $cliArgs
  $result = [regex]::Match($output, '(?s)Result:\s*(.*?)(?:\r?\n\r?\n√ Read operation successfully executed)')
  if (-not $result.Success) { throw "No readback body from $Method." }
  return ConvertFrom-Json -InputObject $result.Groups[1].Value -AsHashtable
}

$issuerAddress = Set-Account $IssuerAccount
$challengerAddress = Set-Account $ChallengerAccount

# This should stop at NOT_OPERATOR before consulting Pride; decisions must stay unchanged.
$before = @(Read-View $GateAddress 'get_decisions' @('0', '10'))
$null = Submit-Write 'unauthorized_gate_operator' $GateAddress 'authorize' @('unauthorized-challenger-probe')
$after = @(Read-View $GateAddress 'get_decisions' @('0', '10'))
if ($after.Count -ne $before.Count) { throw 'Unauthorized Gate call changed decision state.' }

$cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
if ($cases.Count -eq 0) {
  $null = Submit-Write 'open_evidence_challenge' $PrideAddress 'open_challenge' @(
    '0', '1', $changed, 'Community allocation is now 15%.')
  $cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
}
if ($cases.Count -ne 1 -or $cases[0].status -ne 'OPEN' -or $cases[0].checkpoint_id -ne 1) {
  throw 'Evidence-backed challenge was not read back as OPEN.'
}

$null = Submit-Write 'unauthorized_rebuttal' $PrideAddress 'rebut_challenge' @(
  '0', $rebuttal, 'The 15% allocation applies to the community category described in the original commitment.')
$cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
if ($cases[0].status -ne 'OPEN' -or $cases[0].rebuttal_url) { throw 'Unauthorized rebuttal changed case state.' }

$null = Set-Account $IssuerAccount
if ($cases[0].status -eq 'OPEN') {
  $null = Submit-Write 'authorized_rebuttal' $PrideAddress 'rebut_challenge' @(
    '0', $rebuttal, 'The 15% allocation applies to the community category described in the original commitment.')
  $cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
}
if ($cases[0].status -eq 'REBUTTED') {
  $null = Submit-Write 'consensus_case_resolution' $PrideAddress 'adjudicate_challenge' @('0')
  $cases = @(Read-View $PrideAddress 'get_challenges' @('0', '0', '10'))
}
if ($cases[0].status -notin @('UPHELD', 'REJECTED', 'INCONCLUSIVE')) { throw 'Challenge did not reach a terminal resolution.' }
$standing = Read-View $PrideAddress 'get_standing' @('0')
$decisions = @(Read-View $GateAddress 'get_decisions' @('0', '10'))

$evidence = [ordered]@{
  network = 'GenLayer Studionet'; chainId = 61999; rpcUrl = $rpc
  prideAddress = $PrideAddress; gateAddress = $GateAddress
  issuerAddress = $issuerAddress; challengerAddress = $challengerAddress
  fixtureCommit = $FixtureCommit; completedAtUtc = [DateTime]::UtcNow.ToString('o')
  unauthorizedGateDecisionCountBefore = $before.Count; unauthorizedGateDecisionCountAfter = $after.Count
  transactions = @($transactions); challenge = $cases[0]; standing = $standing; gateDecisions = $decisions
}
$json = $evidence | ConvertTo-Json -Depth 20
[IO.File]::WriteAllText((Join-Path $PSScriptRoot '..\docs\live-lifecycle-case-v1.json'), $json + "`n", [Text.UTF8Encoding]::new($false))
Write-Output $json
