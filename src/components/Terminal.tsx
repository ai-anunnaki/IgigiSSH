import React, { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

interface Props {
  connId: string
  active: boolean
}

export default function Terminal({ connId, active }: Props) {
  const termRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const api = (window as any).electronAPI

  useEffect(() => {
    if (!termRef.current) return

    const term = new XTerm({
      theme: {
        background: '#0d0d1a',
        foreground: '#f8f8f2',
        cursor: '#50fa7b',
        black: '#21222c', red: '#ff5555', green: '#50fa7b',
        yellow: '#f1fa8c', blue: '#6272a4', magenta: '#ff79c6',
        cyan: '#8be9fd', white: '#f8f8f2',
        brightBlack: '#6272a4', brightRed: '#ff6e6e', brightGreen: '#69ff94',
        brightYellow: '#ffffa5', brightBlue: '#d6acff', brightMagenta: '#ff92df',
        brightCyan: '#a4ffff', brightWhite: '#ffffff'
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
      fontSize: 13,
      lineHeight: 1.4,
      cursorBlink: true,
      scrollback: 5000,
      allowProposedApi: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(termRef.current)

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    setTimeout(() => {
      fitAddon.fit()
      api.sshResize(connId, term.cols, term.rows)
    }, 50)

    // 接收数据
    api.onSshData(connId, (data: string) => {
      term.write(data)
    })

    // 发送输入
    term.onData((data) => {
      api.sshWrite(connId, data)
    })

    // 连接关闭
    api.onSshClosed(connId, () => {
      term.write('\r\n\x1b[33m[连接已断开]\x1b[0m\r\n')
    })

    // 窗口大小变化
    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current && xtermRef.current) {
        try {
          fitAddonRef.current.fit()
          api.sshResize(connId, xtermRef.current.cols, xtermRef.current.rows)
        } catch {}
      }
    })

    if (termRef.current.parentElement) {
      resizeObserver.observe(termRef.current.parentElement)
    }

    return () => {
      api.offSshData(connId)
      resizeObserver.disconnect()
      term.dispose()
    }
  }, [connId])

  // 当标签页激活时重新fit
  useEffect(() => {
    if (active && fitAddonRef.current && xtermRef.current) {
      setTimeout(() => {
        fitAddonRef.current?.fit()
        api.sshResize(connId, xtermRef.current!.cols, xtermRef.current!.rows)
        xtermRef.current?.focus()
      }, 50)
    }
  }, [active])

  return (
    <div
      ref={termRef}
      style={{ height: '100%', padding: '4px 0', background: '#0d0d1a' }}
    />
  )
}
