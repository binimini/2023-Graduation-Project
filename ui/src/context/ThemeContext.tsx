import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ThemeProvider as StyledProvider } from "styled-components";

const commonTheme = {
  pointColor: "#00ADB5",
};

const lightTheme = {
    ...commonTheme,
    darkerColor: '-',
    baseColor: "#222831",
    bgColor: "#393E46",
    textColor: "#EEEEEE",
};

const darkTheme = {
  // 추후 추가 예정 ..
  ...commonTheme,
  darkerColor: "#1b2128",
  baseColor: "#222831",
  bgColor: "#393E46",
  textColor: "#EEEEEE",
};

type propType = {
    children: React.ReactNode;
};

const ThemeContext = createContext({
    themeMode: 'dark',
    setThemeMode: (themeMode: string) => {},
    themeColorset: null,
});

export const ThemeProvider = ({children}: propType) => {
    const [themeMode, setThemeMode] = useState('light');
    const themeColorset = themeMode === 'light' ? lightTheme : darkTheme;

    useEffect(()=>{
        const initialTheme = window?.localStorage.getItem("theme") || 'light';
        setThemeMode(initialTheme);
    })
  
    return(
      <ThemeContext.Provider value={{ themeMode, setThemeMode}}>
        <StyledProvider theme={themeColorset}>
          { children }
        </StyledProvider>      
      </ThemeContext.Provider>
    )
  }
  
export const useTheme = ()=>{
    const context = useContext(ThemeContext);
    const { themeMode, setThemeMode } = context;
    const themeColorset = themeMode === 'light' ? lightTheme : darkTheme;

    const toggleTheme = useCallback(() => {
        if (themeMode === "light") {
            setThemeMode("dark");
            window.localStorage.theme = 'dark';
        }
        else {
            setThemeMode("light")
            window.localStorage.theme = 'light';
        };
        
    }, [themeMode]);
  
  return { themeMode, toggleTheme, themeColorset};
}
