export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        background: '#f5f5f2',
        color: '#111',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          margin: 0,
        }}
      >
        guitar Note
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          style={{
            minWidth: '130px',
            padding: '14px 28px',
            fontSize: '1.1rem',
            border: '2px solid #111',
            borderRadius: '999px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Note
        </button>
        <button
          type="button"
          style={{
            minWidth: '130px',
            padding: '14px 28px',
            fontSize: '1.1rem',
            border: '2px solid #111',
            borderRadius: '999px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Learn
        </button>
      </div>

      <p
        style={{
          fontSize: '1.4rem',
          margin: 0,
        }}
      >
        Hello my boy
      </p>
    </main>
  );
}
