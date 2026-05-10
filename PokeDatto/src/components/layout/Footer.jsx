import { useSettings } from '../../contexts/SettingsContext';

function Footer() {
  const { isDark } = useSettings();
  return (
    <footer
      style={{
        height: '50px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isDark ? '#1a1b23' : '#42a5f5',
        borderTop: isDark ? '3px solid #2e303a' : '3px solid #1976d2'
      }}
    />
  );
}

export default Footer;
