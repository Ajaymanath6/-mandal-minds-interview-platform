export default function SimpleDropdown({ 
  isOpen, 
  onClose, 
  dropdownRef, 
  items = [], 
  position = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' },
  width = '208px',
  selectedOption = null
}) {
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white rounded-lg border z-50 flex flex-col"
      style={{
        width: width,
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        padding: '6px',
        gap: '4px',
        borderColor: '#E5E5E5',
        borderWidth: '1px',
        boxShadow: '0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A',
        borderRadius: '8px',
      }}
    >
      {items.map((item, index) => {
        const isSelected = selectedOption && selectedOption.label === item.label;
        return (
          <button
            key={index}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[#F5F5F5]"
            style={{ fontFamily: 'Open Sans' }}
          >
            {item.icon && <item.icon size={20} style={{ color: '#7c00ff' }} />}
            <span 
              className="text-sm font-medium" 
              style={{ 
                color: isSelected ? '#1A1A1A' : '#1A1A1A', 
                fontFamily: 'Open Sans',
                fontWeight: isSelected ? 600 : 500
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

