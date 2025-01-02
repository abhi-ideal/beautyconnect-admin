import { useDispatch, useSelector, useStore } from 'react-redux'
import type { RootState, AppDispatch, AppStore } from './store'

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: any = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: any = useSelector.withTypes<RootState>()
export const useAppStore: any = useStore.withTypes<AppStore>()