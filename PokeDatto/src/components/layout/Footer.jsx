import { useSettings, useTranslation } from '../../contexts/SettingsContext';

function Footer() {
  const { isDark } = useSettings();
  const { t } = useTranslation();

  return (
    <footer
      className="d-flex align-items-center justify-content-between px-4"
      style={{
        height: '50px',
        backgroundColor: isDark ? '#1a1b23' : '#42a5f5',
        borderTop: isDark ? '3px solid #2e303a' : '3px solid #1976d2'
      }}
    >
      {/* Left: Author name */}
      <span
        className="fw-bold d-none d-md-block"
        style={{
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.95)'
        }}
      >
        Alejandro Campos Sampedro
      </span>

      {/* Center: Copyright */}
      <span
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.85)'
        }}
      >
        {t('footer.copyright')}
      </span>

      {/* Right: GitHub icon */}
      <a
        href="https://github.com/Alejandro1703"
        target="_blank"
        rel="noopener noreferrer"
        className="d-flex align-items-center text-decoration-none"
        style={{
          color: 'rgba(255,255,255,0.9)',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
      >
        <svg
          height="22"
          width="22"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>
    </footer>
  );
}

export default Footer;
