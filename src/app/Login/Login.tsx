import React from 'react';


// const Login: React.FC = () => {
//   const { login, isLoading, error } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const history = useHistory();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await login(email, password);
//       history.push('/');
//     } catch (err) {
//       // Error is already handled in the AuthContext
//       console.error('Login failed:', err);
//     }
//   };

//   return (
//     <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-red-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">
//                     Login Failed
//                   </h3>
//                   <div className="mt-2 text-sm text-red-700">
//                     {error.message}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="username" className="sr-only">
//                 TACC Username
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="text"
//                 required
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="TACC Username"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
//             >
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;




import { getTaccOauthUrl } from '../../utils/auth';

const Login: React.FC = () => {
  const handleLoginClick = () => {
    // Obtenemos la URL base de Tapis desde las variables de entorno
    const basePath = import.meta.env.VITE_TAPIS_API_BASE_URL || 'https://portals.tapis.io';
    
    // Redirigimos al portal de login de TACC
    window.location.href = getTaccOauthUrl(basePath);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Stories UI</h2>
        <p className="text-sm text-gray-600 mb-8">Authenticator for stories-ui with AI Agent</p>
        
        <button
          onClick={handleLoginClick}
          className="w-full py-3 px-4 text-white font-medium bg-primary-600 hover:bg-primary-700 rounded-md shadow transition-colors"
        >
          Sign in with TACC Account
        </button>
      </div>
    </div>
  );
};

export default Login;