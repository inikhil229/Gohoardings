import NextAuth from "next-auth/next";
import LinkedInProvider from "next-auth/providers/linkedin";


export default NextAuth({
  
    providers: [
      
        LinkedInProvider({
          clientId: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          NEXTAUTH_URL:process.env.NEXTAUTH_URL
        })
      ],
    secret:"thisismysecretejsonWebToken"
})