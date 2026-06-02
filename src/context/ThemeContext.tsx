import {
    createContext,
    useContext,
    useState
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const [theme, setTheme] = useState<ThemeMode>(
        localStorage.getItem("theme") as ThemeMode ?? "light"
    );

    const toggleTheme = () => {

        const nextTheme =
            theme === "light"
                ? "dark"
                : "light";

        setTheme(nextTheme);

        localStorage.setItem(
            "theme",
            nextTheme
        );
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {

    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
}
