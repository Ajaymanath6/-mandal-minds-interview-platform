import { useNavigate } from "react-router-dom";
import { User, UserAvatar, Settings, Logout } from "@carbon/icons-react";

export default function AccountDropdown({ isOpen, onClose, userDropdownRef, isSidebarCollapsed = false }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      ref={userDropdownRef}
      className="absolute bottom-full mb-2 bg-white rounded-lg border z-50 flex flex-col"
      style={{
        width: '208px',
        left: isSidebarCollapsed ? '64px' : '208px',
        padding: '6px',
        gap: '4px',
        borderColor: '#E5E5E5',
        borderWidth: '1px',
        boxShadow: '0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A',
        borderRadius: '8px',
      }}
    >
      {/* Header Section */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-3" style={{ marginBottom: '2px' }}>
          <User size={20} style={{ color: '#575757' }} />
          <span className="text-sm font-medium" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
            John Doe
          </span>
        </div>
        <div className="pl-8">
          <span className="text-xs" style={{ color: '#575757', fontFamily: 'Open Sans' }}>
            john.doe@example.com
          </span>
        </div>
      </div>
      
      <button
        onClick={() => {
          onClose();
          // Handle profile action
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[#F5F5F5]"
        style={{ fontFamily: 'Open Sans' }}
      >
        <UserAvatar size={20} style={{ color: '#575757' }} />
        <span className="text-sm font-medium" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
          Profile
        </span>
      </button>
      <button
        onClick={() => {
          onClose();
          // Handle settings action
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[#F5F5F5]"
        style={{ fontFamily: 'Open Sans' }}
      >
        <Settings size={20} style={{ color: '#575757' }} />
        <span className="text-sm font-medium" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
          Settings
        </span>
      </button>
      <button
        onClick={() => {
          onClose();
          navigate("/");
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[#F5F5F5]"
        style={{ fontFamily: 'Open Sans' }}
      >
        <Logout size={20} style={{ color: '#575757' }} />
        <span className="text-sm font-medium" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
          Logout
        </span>
      </button>
    </div>
  );
}

