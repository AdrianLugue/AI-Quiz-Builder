import Link from 'next/link';

const Header = () => {
    return (
        <header>
            <nav className='px-4 py-2.5 flex gap-2'>
                <Link href="/Quiz" className="underline">Sample Quiz</Link>
                <Link href="/Quiz/new" className="underline">New Quiz</Link>
            </nav>
        </header>
    )
}

export default Header;