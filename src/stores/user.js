import { defineStore } from "pinia";
import { supabase } from "../supabase";

export default defineStore("user", {
  state() {
    return {
      user: null,
      verificationEmail: false,
    };
  },
  actions: {
    async signUp(firstName, email, password, confirmPassword) {
      if (password === confirmPassword) {
        this.verificationEmail = true;
        setTimeout(() => {
          this.verificationEmail = false;
        }, 5000);
        const response = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              firstName: firstName,
            },
          },
        })
        // this.user = response.data.user
      } else {
        console.log("Password status: Doesn't match")
      }
    },
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      this.user = data.user;
      if (error) {
        console.log("error: ", error)
        alert(error.error_description)
      } else {
        this.$router.push({ path: '/dashboard' })
      }
    },
    async signOut() {
      const { error } = await supabase.auth.signOut()
      this.user = null
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
      },
    ],
  },
})

