import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus("success")
    } catch (error) {
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl w-full">
      <div className="absolute inset-0 z-0">
        <img
          src="/newsletter.webp"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80"></div>
      </div>

      <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-pink-500/10 rounded-full translate-x-20 translate-y-20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-yellow-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-lg"></div>

      <div className="relative z-10 py-16 px-6 max-w-xl mx-auto">
        {status === "success" ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Vous êtes inscrit !</h2>
            <p className="text-white/80 mb-6">Merci de rejoindre notre communauté de newsletter.</p>
            <Button
              onClick={() => {
                setEmail("")
                setStatus(null)
              }}
              className="bg-white text-indigo-900 hover:bg-white/90"
            >
              S'inscrire à nouveau
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Restez inspiré</h2>
            <p className="text-white/80 mb-8 text-lg">Rejoignez notre communauté créative pour des mises à jour exclusives</p>

            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
              <div className="backdrop-blur-sm bg-white/10 p-1 rounded-full">
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-grow bg-transparent border-0 text-white placeholder:text-white/60 focus:ring-0 rounded-full pl-6"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-white text-indigo-900 hover:bg-white/90 px-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="h-4 w-4 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Inscription...</span>
                      </span>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-white/60 mt-4">Pas de spam, que des bonnes vibes. Désinscription à tout moment.</p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
