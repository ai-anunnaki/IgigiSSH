import React, { useState } from 'react'

interface Props {
  onConnect: (config: any) => void
  onClose: () => void
}

export default function ConnectModal({ onConnect, onClose }: Props) {
  const [form, setForm] = useState({
    label: '', host: '', port: '22', username: 'root',
    authType: 'password' as 'password' | 'privateKey',
    password: '', privateKeyPath: '', passphrase: '', save: true
  })
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.host || !form.username) {
      setError('请填写主机和用户名')
      return
    }
    setConnecting(true)
    setError('')
    onConnect({ ...form, port: parseInt(form.port) || 22 })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 12, padding: '24px 28px',
        width: 440, border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>新建SSH连接</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 标签 */}
          <div>
            <label style={labelStyle}>标签名称（可选）</label>
            <input style={inputStyle} value={form.label} onChange={e => set('label', e.target.value)} placeholder="e.g. 生产服务器" />
          </div>

          {/* 主机和端口 */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 3 }}>
              <label style={labelStyle}>主机 *</label>
              <input style={inputStyle} value={form.host} onChange={e => set('host', e.target.value)} placeholder="192.168.1.100" required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>端口</label>
              <input style={inputStyle} value={form.port} onChange={e => set('port', e.target.value)} placeholder="22" />
            </div>
          </div>

          {/* 用户名 */}
          <div>
            <label style={labelStyle}>用户名 *</label>
            <input style={inputStyle} value={form.username} onChange={e => set('username', e.target.value)} placeholder="root" required />
          </div>

          {/* 认证方式 */}
          <div>
            <label style={labelStyle}>认证方式</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['password', 'privateKey'] as const).map(t => (
                <button
                  key={t} type="button"
                  onClick={() => set('authType', t)}
                  style={{
                    flex: 1, padding: '7px 0', border: '1px solid',
                    borderColor: form.authType === t ? 'var(--accent)' : 'var(--border)',
                    borderRadius: 6, background: form.authType === t ? 'rgba(91,141,238,0.15)' : 'transparent',
                    color: form.authType === t ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 12, fontWeight: 600
                  }}
                >
                  {t === 'password' ? '🔑 密码' : '🗝 私钥'}
                </button>
              ))}
            </div>
          </div>

          {/* 密码 */}
          {form.authType === 'password' && (
            <div>
              <label style={labelStyle}>密码</label>
              <input style={inputStyle} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="SSH 密码" />
            </div>
          )}

          {/* 私钥 */}
          {form.authType === 'privateKey' && (
            <>
              <div>
                <label style={labelStyle}>私钥路径</label>
                <input style={inputStyle} value={form.privateKeyPath} onChange={e => set('privateKeyPath', e.target.value)} placeholder="~/.ssh/id_rsa" />
              </div>
              <div>
                <label style={labelStyle}>私钥密语（可选）</label>
                <input style={inputStyle} type="password" value={form.passphrase} onChange={e => set('passphrase', e.target.value)} placeholder="私钥保护密码" />
              </div>
            </>
          )}

          {/* 保存 */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={form.save} onChange={e => set('save', e.target.checked)} />
            保存到主机列表
          </label>

          {error && <div style={{ color: 'var(--danger)', fontSize: 12, padding: '6px 10px', background: 'rgba(255,85,85,0.1)', borderRadius: 6 }}>{error}</div>}

          {/* 提交 */}
          <button
            type="submit"
            disabled={connecting}
            style={{
              marginTop: 4, padding: '10px', background: 'var(--accent)',
              border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, opacity: connecting ? 0.7 : 1
            }}
          >
            {connecting ? '连接中...' : '连接'}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 4, fontSize: 11,
  color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase'
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px',
  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
  borderRadius: 6, color: 'var(--text-primary)', fontSize: 13, outline: 'none',
}
