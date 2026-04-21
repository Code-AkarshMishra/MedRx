import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-12 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="mt-4 text-sm leading-relaxed text-slate-500">
                            Understanding your medical reports is now effortless. MedRx uses advanced AI to translate complex clinical terminology into simple, actionable insights.
                        </p>
                    </div>

                    {/* <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Platform</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><a href="#features" className="hover:text-blue-600 transition">Features</a></li>
                            <li><a href="/portal" className="hover:text-blue-600 transition">AI Analyzer Workspace</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Sample Reports</a></li>
                        </ul>
                    </div> */}

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Company</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
                            <li><a href="#contact" className="hover:text-blue-600 transition">Contact Support</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition"></a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Team</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-blue-600 transition">Akarsh Mishra</a></li>
                            <li><a href="#contact" className="hover:text-blue-600 transition">Rohanpreet Arora</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Saksham Sahu</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition"></a></li>
                        </ul>
                    </div>

                    <div id="contact">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Connect</h4>
                        <p className="mt-4 text-sm text-slate-600">support.medrx@gmail.com</p>
                        <a href="#contact" className="hover:text-blue-600 transition">akarsh38560.srmu@gmail.com</a><br></br>
                        <a href="#" className="hover:text-blue-600 transition">rohanpreet37709.srmu@gmail.com</a><br></br>
                        <a href="#contact" className="hover:text-blue-600 transition">saksham35923.srmu@gmail.com</a>

                        {/* <div className="mt-4 flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition">in</div>
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition">M</div>
                        </div> */}
                    </div>
                </div>

                <div className="mt-16 border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
                    <span>© {new Date().getFullYear()} MedRx Platform. All rights reserved.</span>
                    <span>Secured with Advanced AI Encryption</span>
                </div>
            </div>
        </footer>
    );
}