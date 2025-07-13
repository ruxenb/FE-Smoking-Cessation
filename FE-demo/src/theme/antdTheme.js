// Đây là một ví dụ cơ bản. Bạn có thể mở rộng nó rất nhiều.
// Tham khảo toàn bộ token tại: https://ant.design/docs/react/customize-theme

export const antdTheme = {
    token: {
        // === MÀU SẮC CHỦ ĐẠO ===
        colorPrimary: '#305030', // <-- Giống hệt --primary-green của bạn
        colorSuccess: '#4caf50',
        colorWarning: '#ffb300',
        colorError: '#e53935',
        colorInfo: '#2196f3',

        // === FONT CHỮ ===
        fontFamily: "'Inter', sans-serif", // <-- Giống hệt font bạn đang dùng

        // === MÀU NỀN & CHỮ ===
        colorTextBase: '#1a1a1a', // <-- Giống --text-dark
        colorBgLayout: '#F4F7F6', // <-- Giống --bg-light (màu nền chung)
        
        // === BO GÓC (BORDER RADIUS) ===
        borderRadius: 8, // Áp dụng cho Button, Input, Card...

        // === TÙY CHỈNH RIÊNG CHO COMPONENT ===
        Card: {
            colorBgContainer: '#ffffff', // <-- Giống --card-bg
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // <-- Giống --shadow
            borderRadiusLG: 12,
        },
        Table: {
            colorBgContainer: '#ffffff', // Nền của bảng
        },
        Button: {
            // ...
        }
    },
    components: {
        // Tùy chỉnh riêng cho Sider (thanh bên)
        Layout: {
            colorBgSider: '#0A100A', // <-- Màu nền của Sidebar, giống --sidebar-bg
        },
        // Tùy chỉnh riêng cho Menu
        Menu: {
            colorItemBg: 'transparent', // Nền của mục menu -> trong suốt để lấy màu của Sider
            colorItemText: 'rgba(255, 255, 255, 0.75)', // Màu chữ của mục menu
            colorItemTextHover: '#ffffff', // Màu chữ khi di chuột
            
            // Màu cho mục được chọn
            colorItemBgSelected: '#305030', // <-- Màu xanh lá cây chủ đạo
            colorItemTextSelected: '#ffffff', // Chữ trắng khi được chọn

            // Màu cho mục Logout (danger)
            colorError: '#e53935', // Màu chữ cho item có `danger`
            colorErrorHover: '#ff4d4f', // Màu chữ khi di chuột vào item `danger`
        },
        Card: {
            colorBgContainer: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderRadiusLG: 12,
        },
        Table: {
            colorBgContainer: '#ffffff',
        },
    }
};

// Bạn cũng có thể tạo một theme cho Dark Mode nếu cần
export const antdDarkTheme = {
    // ...
}