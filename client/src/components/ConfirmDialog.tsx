interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button
            type="button"
            className="dialog-button cancel"
            onClick={onCancel}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="dialog-button confirm"
            onClick={onConfirm}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
