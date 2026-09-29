import Link from 'next/link';
import Image from "next/image";

const NavbarBlog = () => {
  return (
    <nav className="navbar navbar-expand-lg py-3 ">
      <div className="container">
        <Link href="/blog">
    
            <Image
              width={190}
              height={40}
              src="/images/web_pics/logo.png"
              alt="gohoardings"
            />
       
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/blog/billboard" className='nav-link'>
                Billboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog/digital-billboard" className='nav-link'>
                Digital Billboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog/mall-media" className='nav-link'>
                Mall Media
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog/inflight-branding" className='nav-link'>
                Inflight Branding
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog/lift-branding" className='nav-link'>
                Lift Branding
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog/transit-media" className='nav-link'>
                Transit Media
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog/airport-branding" className='nav-link'>
                Airport Branding
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        
      `}</style>
    </nav>
  );
};

export default NavbarBlog;
