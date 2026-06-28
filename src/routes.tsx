import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Home from '@/pages/Home'
import DocsIndex from '@/pages/docs/index'
import DocsCategory from '@/pages/docs/DocsCategory'
import DocsDetail from '@/pages/docs/DocsDetail'
import SearchPage from '@/pages/SearchPage'
import NotFound from '@/pages/error/index'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/register/index'
import ProfilePage from '@/pages/ProfilePage'
import BlogIndex from '@/pages/blog/index'
import BlogDetail from '@/pages/blog/BlogDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'docs', element: <DocsIndex /> },
      { path: 'docs/:category', element: <DocsCategory /> },
      { path: 'docs/:category/:slug', element: <DocsDetail /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'blog', element: <BlogIndex /> },
      { path: 'blog/:slug', element: <BlogDetail /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
