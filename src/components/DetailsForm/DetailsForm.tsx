import { Text } from '@/shared/components/Text'

import styles from './DetailsForm.module.scss'
import { VenueSlugInput } from './VenueSlugInput'
import { CartInput } from './CartInput'
import { UserCoordinatesInput } from './UserCoordinatesInput'

const componentMap = {
  slug: <VenueSlugInput />,
  cart: <CartInput />,
  userCoordinates: <UserCoordinatesInput />
}

export const DetailsForm = () => (
  <section className={styles.DetailsForm}>
    <Text as="h2" type="title-2">
      Details
    </Text>

    <ul className={styles.FormList}>
      {Object.keys(componentMap).map(key => (
        <li key={key}>
          {componentMap[key as keyof typeof componentMap]}
          <hr className={styles.FormSeparator} />
        </li>
      ))}
    </ul>
  </section>
)
