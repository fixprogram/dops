import { Icon } from '@/shared/components/Icon'
import { Loader } from '@/shared/components/Loader'
import styles from './ShareLocationButton.module.scss'
import { useShareLocation } from './useShareLocation'

export const ShareLocationButton = () => {
  const { handleShareLocation, isLoading } = useShareLocation()

  return (
    <button
      type={'button'}
      className={styles.ShareLocationButton}
      onClick={handleShareLocation}
      aria-label={'Share location'}
      disabled={isLoading}
      data-test-id={'getLocation'}
    >
      {isLoading ? <Loader /> : <Icon name="pin" />}
    </button>
  )
}
