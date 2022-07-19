function Hero() {
  return (
    <div className="flex justify-between items-center bg-[url('../assets/background.gif')] border-y border-black py-10 lg:py-0"> 
        <div className="px-10 space-y-5 font-serif text-white">
        <h1 className="text-6xl max-w-xl"><span className="underline decoration-black decoration-4">Finding Aces</span> is a blog focused on discussing golf from address to impact</h1>
        <h2 className="text-xl">Discussing golf. One step at a time.</h2>
        </div>

        <div>
            <img src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="" className="hidden md:inline-flex h-32 lg:h-full"/>
        </div>
    </div>
  )
}

export default Hero