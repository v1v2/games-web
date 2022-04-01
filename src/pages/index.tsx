const games = [
  { href: '/platformer', title: 'Basic Platformer' },
  { href: '/city', title: 'City Management' },
  { href: '/tower', title: 'Tower Defense' },
  { href: '/island', title: 'VR Island' },
]

const IndexPage = () => (
  <>
    <a href="https://v1v2.io/gamedev" target="_blank" rel="noopener noreferrer">
      About my Game Dev journey
    </a>
    <h1>Games</h1>
    <ul>
      {games.map(g => (
        <li key={g.href}>
          <a href={g.href} target="_blank" rel="noopener noreferrer">
            {g.title}
          </a>
        </li>
      ))}
    </ul>
  </>
)

export default IndexPage
