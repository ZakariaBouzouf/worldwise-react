import { useEffect } from "react"
import { useAuth } from "../contexts/FakeAuthContext"
import { useNavigate } from 'react-router-dom'

export default function ProtecedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  return isAuthenticated ? children : null

}
