import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
export default function Footer() {
  return (
    <>
      <footer className="mt-3 bg-blue-950">
        <div className="mt-3 mb-3">
          <h1 className="text-2xl text-center font-semibold text-white mt-3">
            Testimonials
          </h1>
          <p className="mt-1 text-md sm:text-lg text-gray-300 text-center font-semibold">
            "Medilink made Healthcare seamless for me!"
          </p>
        </div>
        <div className="contacts flex justify-center gap-6 mb-2">
          <a
            href="https://www.linkedin.com/in/rishaw-raj-349246350/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl bg-gray-200 rounded-sm"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.linkedin.com/in/rishaw-raj-349246350/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl bg-gray-200 rounded-sm"
          >
            <FaSquareInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/rishaw-raj-349246350/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl bg-gray-200 rounded-sm"
          >
            <BiLogoGmail />
          </a>
        </div>

        <div className="privacy-terms flex justify-center gap-3 mb-5 text-gray-200 ">
          <Link href="/">
            <p className="font-semibold">Privacy</p>
          </Link>
          <p className="font-semibold">|</p>
          <Link href="/">
            <p className="font-semibold">Terms</p>
          </Link>
        </div>
      </footer>
    </>
  );
}
