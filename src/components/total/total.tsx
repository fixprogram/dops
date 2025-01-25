import { FC } from 'react'
import { convertCentsToEuros } from '../../utils/convertCentsToEuros'
import { Keys, useTotal } from '../../hooks/useTotal'
import { Icon } from '../ui/Icon/Icon'
import { Text } from '../ui/Text/Text'

import styles from './total.module.scss'

const titles: Record<Keys, string> = {
  deliveryFee: 'Delivery',
  smallOrderSurcharge: 'Small order surcharge',
  cart: 'Cart value'
}

export const Total: FC = () => {
  const { formattedData, total, distance, deliveryError } = useTotal()

  return (
    <section className={styles.Total}>
      <Text as="h2" type="subtitle">
        Prices in EUR
      </Text>
      {!deliveryError ? <Text type="body-2">Fill order details to see total</Text> : null}

      {!deliveryError ? (
        <dl className={styles.Items}>
          {formattedData.map(({ key, value }) => (
            <div key={key} className={styles.Item}>
              <Text as="dt">
                {titles[key]}
                {key === 'deliveryFee' ? (
                  <span data-raw-value={distance}>{` (${distance} m)`}</span>
                ) : null}
              </Text>
              <Text as="dd" data-raw-value={value}>
                {convertCentsToEuros(value)}
              </Text>
            </div>
          ))}

          {total ? (
            <div key={'total'} className={styles.Item}>
              <Text as="b">Total</Text>
              <Text as="b" data-raw-value={total}>
                {convertCentsToEuros(total)}
              </Text>
            </div>
          ) : null}
        </dl>
      ) : null}

      {deliveryError && (
        <Text color="error">
          <Icon name="error" className={styles.ErrorIcon} />
          {deliveryError}
        </Text>
      )}
    </section>
  )
}
