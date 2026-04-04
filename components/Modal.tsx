export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black uppercase">{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant">X</button>
        </div>
        {children}
      </div>
    </div>
  );
}
