'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToast } from '@/components/Toast'

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const res = await fetch(`/api/apis/${id}`, { method: 'DELETE' })
    setLoading(false)
    setOpen(false)
    if (res.ok) {
      toast(`"${name}" deleted`, 'success')
      router.refresh()
    } else {
      toast('Failed to delete. Try again.', 'error')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Delete ${name}`}
        style={{
          padding: '0.4375rem',
          background: 'transparent',
          border: '1px solid #1e2e28',
          borderRadius: '0.375rem',
          color: '#3d5a4e',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#f87171'
          e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#3d5a4e'
          e.currentTarget.style.borderColor = '#1e2e28'
        }}
      >
        <Trash2 size={14} />
      </button>

      <ConfirmDialog
        open={open}
        title="Delete mock API"
        message={`"${name}" will be permanently deleted and its URL will stop working.`}
        confirmLabel="Delete"
        danger
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
