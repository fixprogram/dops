import { FC } from 'react'
import styles from './total.module.css'
import { convertCentsToEuros } from '../../utils/convertCentsToEuros'
import { Keys, useTotal } from '../../hooks/useTotal'
import { Icon } from '../ui/Icon/Icon'

const titles: Record<Keys, string> = {
  deliveryFee: 'Delivery',
  smallOrderSurcharge: 'Small order surcharge',
  cart: 'Cart value'
}

export const Total: FC = () => {
  const { formattedData, total, distance, deliveryError } = useTotal()

  return (
    <section className={styles.Total}>
      <span className={styles.Title}>
        Prices in EUR
        {!deliveryError ? (
          <span className={styles.Subtitle}>Fill details form to see total</span>
        ) : null}
      </span>

      {!deliveryError ? (
        <dl className={styles.Items}>
          {formattedData.map(({ key, value }) => (
            <div key={key} className={styles.Item}>
              <dt className={styles.ItemTitle}>
                {titles[key]}
                {key === 'deliveryFee' ? (
                  <span data-raw-value={distance}>{` (${distance} m)`}</span>
                ) : null}
              </dt>
              <dd className={styles.ItemValue} data-raw-value={value}>
                {convertCentsToEuros(value)}
              </dd>
            </div>
          ))}

          {total ? (
            <div key={'total'} className={styles.Item}>
              <dt className={styles.ItemTitle} style={{ fontWeight: 700 }}>
                Total
              </dt>
              <dd className={styles.ItemValue} style={{ fontWeight: 700 }} data-raw-value={total}>
                {convertCentsToEuros(total)}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {deliveryError && (
        <div>
          <p className={styles.Error}>
            <Icon name="error" className={styles.ErrorIcon} />
            {deliveryError}
          </p>
        </div>
      )}
    </section>
  )
}
