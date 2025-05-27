import { $pageTitle, handleClearPageTitle, handleSetPageTitle } from "@/context/page"
import { useUnit } from "effector-react"
import { useEffect } from "react"

// export const usePageTitle = (page: string, additionalText = "") => {
//   useEffect(() => {
//     document.title = `WishWave | ${page}${additionalText ? ` - ${additionalText}` : ``}`;
//   }, [additionalText, page]);
// };

export const usePageTitle = (title: string, additionalText = "") => {
  const [pageTitle, setPageTitle, clearPageTitle] = useUnit([$pageTitle, handleSetPageTitle, handleClearPageTitle])

  setPageTitle(title)

  useEffect(() => {
    document.title = `WishWave | ${pageTitle}${additionalText ? ` - ${additionalText}` : ``}`
    return () => {
      document.title = `WishWave`
    }
  }, [additionalText, pageTitle])
}
