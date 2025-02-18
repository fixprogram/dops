import { FC } from 'react'
import { Icon } from '@/shared/components/Icon'
import { Text } from '@/shared/components/Text'

import { Keys, useTotal } from './useTotal'
import styles from './Total.module.scss'
import { convertCentsToEuros } from './Total.utils'

const titles: Record<Keys, string> = {
  deliveryFee: 'Delivery',
  smallOrderSurcharge: 'Small order surcharge',
  cart: 'Cart value'
}

export const Total: FC = () => {
  const { formattedData, total, distance, deliveryError } = useTotal()

  return (
    <section className={styles.Total}>
      <div>
        <Text as="h2" type="title-3">
          Prices in EUR
        </Text>
        {!deliveryError ? <Text type="body-2">Fill order details to see total</Text> : null}
      </div>

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
              <Text as="b" weight="semibold">
                Total
              </Text>
              <Text as="b" weight="semibold" data-raw-value={total}>
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
