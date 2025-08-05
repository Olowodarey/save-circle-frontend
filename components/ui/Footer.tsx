import Link from "next/link";
import {Coins} from "lucide-react";

const Footer = () => {
   return  <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
            <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Save Circle</span>
            </div>
            <p className="text-gray-400">
                Decentralized savings circles built on Starknet for global financial inclusion.
            </p>
            </div>

            <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
                <li>
                <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                </Link>
                </li>
                <li>
                <Link href="/groups" className="hover:text-white">
                    Groups
                </Link>
                </li>
                <li>
                <Link href="/reputation" className="hover:text-white">
                    Reputation
                </Link>
                </li>
            </ul>
            </div>

            <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
                <li>
                <a href="#" className="hover:text-white">
                    Documentation
                </a>
                </li>
                <li>
                <a href="#" className="hover:text-white">
                    Smart Contracts
                </a>
                </li>
                <li>
                <a href="#" className="hover:text-white">
                    Security
                </a>
                </li>
            </ul>
            </div>

            <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
                <li>
                <a href="#" className="hover:text-white">
                    Discord
                </a>
                </li>
                <li>
                <a href="#" className="hover:text-white">
                    Twitter
                </a>
                </li>
                <li>
                <a href="#" className="hover:text-white">
                    GitHub
                </a>
                </li>
            </ul>
            </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Save Circle. Built on Starknet.</p>
        </div>
        </div>
  </footer>
}

export default Footer;