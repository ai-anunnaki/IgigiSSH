import React, { useState } from 'react'
import { SavedHost } from '../App'

interface Connection {
  id: string
  label: string
  host: string
  username: string
  status: 'connected' | 'connecting' | 'disconnected'
}

interface Props {
  savedHosts: SavedHost[]
  connections: Connection[]
  activeConnId: string | null
  showFilePanel: boolean
  onConnect: () => void
  onSelectHost: (host: SavedHost) => void
  onSelectTab: (id: string) => void
  onToggleFiles: () => void
  onDeleteHost: (id: string) => void
}

export default function Sidebar({
  savedHosts, connections, activeConnId,
  showFilePanel, onConnect, onSelectHost,
  onSelectTab, onToggleFiles, onDeleteHost
}: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredHost, setHoveredHost] = useState<string | null>(null)

  if (collapsed) {
    return (
      <div style={{
        width: 40, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, gap: 12
      }}>
        <button onClick={() => setCollapsed(false)} style={iconBtn}>☰</button>
        <button onClick={onConnect} title="新建连接" style={iconBtn}>+</button>
        <button onClick={onToggleFiles} title="文件管理" style={{ ...iconBtn, color: showFilePanel ? 'var(--accent)' : undefined }}>📁</button>
      </div>
    )
  }

  return (
    <div style={{
      width: 220, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden'
    }}>
      {/* 头部 */}
      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', letterSpacing: 1 }}>🐦 LuciSSH</span>
        <button onClick={() => setCollapsed(true)} style={iconBtn}>◀</button>
      </div>

      {/* 工具栏 */}
      <div style={{ padding: '8px 10px', display: 'flex', gap: 6, borderBottom: '1px solid var(--border)' }}>
        <button onClick={onConnect} style={toolBtn}>+ 连接</button>
        <button
          onClick={onToggleFiles}
          style={{ ...toolBtn, background: showFilePanel ? 'var(--accent)' : 'var(--bg-hover)', color: showFilePanel ? '#fff' : 'var(--text-secondary)' }}
        >📁 文件</button>
      </div>

      {/* 活跃连接 */}
      {connections.length > 0 && (
        <div style={{ padding: '8px 0' }}>
          <div style={{ padding: '0 12px 4px', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase' }}>活跃会话</div>
          {connections.map(conn => (
            <div
              key={conn.id}
              onClick={() => onSelectTab(conn.id)}
              style={{
                padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                background: conn.id === activeConnId ? 'var(--bg-hover)' : 'transparent',
                color: conn.id === activeConnId ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: 12,
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: conn.status === 'connected' ? 'var(--success)' : conn.status === 'connecting' ? 'var(--warning)' : 'var(--danger)'
              }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conn.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* 已保存的主机 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        <div style={{ padding: '0 12px 4px', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase' }}>
          已保存 ({savedHosts.length})
        </div>
        {savedHosts.length === 0 ? (
          <div style={{ padding: '16px 12px', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
            暂无保存的主机
          </div>
        ) : (
          savedHosts.map(host => (
            <div
              key={host.id}
              onMouseEnter={() => setHoveredHost(host.id)}
              onMouseLeave={() => setHoveredHost(null)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <div
                onClick={() => onSelectHost(host)}
                style={{
                  flex: 1, padding: '7px 12px', cursor: 'pointer', fontSize: 12,
                  color: 'var(--text-secondary)',
                  background: hoveredHost === host.id ? 'var(--bg-hover)' : 'transparent',
                }}
              >
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{host.label}</div>
                <div style={{ fontSize: 11, marginTop: 1, opacity: 0.7 }}>{host.username}@{host.host}:{host.port}</div>
              </div>
              {hoveredHost === host.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteHost(host.id) }}
                  style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 12, padding: '2px 4px' }}
                >✕</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-secondary)', fontSize: 14, padding: '4px',
  borderRadius: 4, lineHeight: 1,
}

const toolBtn: React.CSSProperties = {
  flex: 1, padding: '5px 8px', background: 'var(--bg-hover)',
  border: 'none', borderRadius: 6, cursor: 'pointer',
  color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
}
