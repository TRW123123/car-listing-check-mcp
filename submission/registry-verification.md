# Registry ownership verification — instructions only

Checked 2026-11-03 using curl: [quickstart](https://modelcontextprotocol.io/registry/quickstart), [remote servers](https://modelcontextprotocol.io/registry/remote-servers), [authentication](https://modelcontextprotocol.io/registry/authentication). Downloaded the [official 2025-12-11 JSON schema](https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json) for local validation.

server.json declares com.aicarvideo/car-listing-check, version 0.1.2, website https://aicarvideo.com, and a streamable-http remote https://mcp.aicarvideo.com/mcp. The namespace reverses aicarvideo.com. Authenticate the apex aicarvideo.com, not mcp.aicarvideo.com. GitHub login for TRW123123 does not prove this domain namespace.

Choose ONE proof method with an Ed25519 key. Neither was executed. The placeholders below are not real key material.

- DNS: TXT owner aicarvideo.com. (usually @ in the DNS dashboard), value exactly `v=MCPv1; k=ed25519; p=<BASE64_RAW_ED25519_PUBLIC_KEY>`. This is an apex TXT record, not an _mcp label. Wait for public DNS propagation.
- HTTP: serve https://aicarvideo.com/.well-known/mcp-registry-auth with HTTP 200 and the plain-text line `v=MCPv1; k=ed25519; p=<BASE64_RAW_ED25519_PUBLIC_KEY>`. This belongs on the main website host, not the MCP proxy subdomain. Keep the proof reachable while authenticating.

The public key is the base64 encoding of the raw 32-byte Ed25519 public key, not a PEM block or the entire DER encoding. The documented derivation is `openssl pkey -in "$registry_key_path" -pubout -outform DER | tail -c 32 | base64`; use it only in a separate operator session after approval.

The private key must never be committed, pasted into issues or logged. Keep it outside the repository with restricted permissions. No key was created or read during this task. Future operator commands (not run):

```bash
# Placeholder path only; replace with the operator's actual protected PEM path.
registry_key_path='/home/box/.secrets/[REGISTRY_PRIVATE_KEY_FILE].pem'
# Official CLI expects raw private-key hex, not a filename argument.
# Disable shell tracing and protect shell/session logs before loading it.
registry_private_hex="$(openssl pkey -in "$registry_key_path" -noout -text | sed -n '/priv:/,/pub:/p' | sed '1d;$d' | tr -d ' :\n')"
# Choose DNS OR HTTP after publishing its public proof:
mcp-publisher login dns --domain aicarvideo.com --private-key "$registry_private_hex"
# Alternative (do not run both unnecessarily):
# mcp-publisher login http --domain aicarvideo.com --private-key "$registry_private_hex"
unset registry_private_hex
# Only after explicit approval to publish, from the repository root:
mcp-publisher publish
```

The CLI receives the key in an argument; use a trusted operator machine/session and review current CLI security options before running. Publisher credentials/state must also remain outside version control. Publishing and any DNS/website changes need separate approval; nothing was authenticated or published here. Schema validation establishes structure, not ownership, endpoint compatibility or acceptance.
