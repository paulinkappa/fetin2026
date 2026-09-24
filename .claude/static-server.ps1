param([int]$Port = 5500)

$Root = Split-Path -Parent $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Prefixes.Add("http://localhost:$Port/")
try {
  $listener.Start()
} catch {
  Write-Output ""
  Write-Output "Nao consegui iniciar o servidor na porta $Port."
  Write-Output "Motivo mais provavel: ja tem um servidor VozAtiva rodando em outra janela."
  Write-Output "Isso e normal e nao e um problema - pode fechar esta janela."
  Write-Output "Se o navegador nao abrir http://localhost:$Port sozinho, abra manualmente."
  Write-Output ""
  Write-Output ("Detalhe tecnico: " + $_.Exception.Message)
  Read-Host "Pressione Enter para fechar"
  exit 1
}
Write-Output "Serving $Root on http://localhost:$Port/"

$mime = @{
  ".html"="text/html"; ".htm"="text/html"; ".css"="text/css"; ".js"="application/javascript";
  ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".svg"="image/svg+xml"; ".gif"="image/gif"; ".ico"="image/x-icon"; ".txt"="text/plain";
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".mp3"="audio/mpeg"; ".wav"="audio/wav";
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $req = $ctx.Request
    $res = $ctx.Response
    $path = [System.Uri]::UnescapeDataString($req.Url.LocalPath)
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $Root ($path.TrimStart("/"))

    if (Test-Path $file -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ct = $mime[$ext]
      if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $res.ContentType = $ct
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.ContentLength64 = $msg.Length
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    Write-Output ("Request error: " + $_.Exception.Message)
  } finally {
    $ctx.Response.Close()
  }
}
