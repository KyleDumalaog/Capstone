import { supabase } from './supabaseClient.js';

// ✅ Predefine admin & superadmin
async function registerPredefinedAdmins() {
    const predefinedUsers = [
        { email: "admin@example.com", name: "Admin", role: "admin" },
        { email: "superadmin@example.com", name: "Super Admin", role: "superadmin" }
    ];

    for (const user of predefinedUsers) {
        // 🔹 Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();

        if (fetchError) {
            console.error("Error checking existing user:", fetchError.message);
            return;
        }

        if (!existingUser) {
            // 🔹 Insert predefined user if not found
            const { error: insertError } = await supabase.from("users").insert([
                { email: user.email, name: user.name, role: user.role, points: 0 }
            ]);

            if (insertError) {
                console.error(`Error inserting ${user.role}:`, insertError.message);
            } else {
                console.log(`${user.role} account created: ${user.email}`);
            }
        }
    }
}

// ✅ Run this function on page load
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded");
    
    // 🔹 Ensure predefined accounts exist
    await registerPredefinedAdmins();

    // 🔹 Handle registration form
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Registering:", name, email);
            await registerUser(email, password, name);
        });
    }

    // 🔹 Handle login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Logging in:", email);
            await loginUser(email, password);
        });
    }
});

// ✅ User Registration Function
async function registerUser(email, password, name) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    // 🔹 Get user ID from Supabase
    const userId = data?.user?.id;
    if (!userId) {
        console.error("Error: User ID is undefined");
        return;
    }

    // 🔹 Insert user into `users` table
    const { error: insertError } = await supabase.from("users").insert([
        { id: userId, email, name, role: "user", points: 0 }
    ]);

    if (insertError) {
        console.error("Insert Error:", insertError);
        alert(`Insert failed: ${insertError.message}`);
        return;
    }

    alert("Registration successful! Please check your email.");
}

// ✅ User Login Function
async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
        return;
    }

    // 🔹 Fetch user role
    const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .maybeSingle();

    if (roleError || !userData) {
        console.error("Role Fetch Error:", roleError?.message);
        alert("Error fetching user role or user does not exist.");
        return;
    }

    alert("Login successful!");

    // 🔹 Redirect based on role
    if (userData.role === "superadmin") {
        window.location.href = "superadmin_dashboard.html";
    } else if (userData.role === "admin") {
        window.location.href = "admin_dashboard.html";
    } else {
        window.location.href = "user_dashboard.html";
    }
}
