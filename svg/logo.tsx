function Logo(){
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" role="img" aria-label="save_circle logo">
    {/* Outer ring */}
    <circle cx="512" cy="512" r="420" fill="none" stroke="#2563eb" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Inner ring */}
    <circle cx="512" cy="512" r="340" fill="none" stroke="#2563eb" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Three person dots */}
    <circle cx="512" cy="170" r="44" fill="#2563eb"/>
    <circle cx="770" cy="660" r="44" fill="#2563eb"/>
    <circle cx="254" cy="660" r="44" fill="#2563eb"/>

    {/* Subtle center halo */}
    <circle cx="512" cy="512" r="120" fill="#2563eb" opacity="0.06"/>
    </svg>
}

export default Logo;