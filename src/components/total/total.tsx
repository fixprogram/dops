import { FC } from 'react'
import styles from './total.module.css'
import { convertCentsToEuros } from '../../utils/convertCentsToEuros'
import { Keys, useTotal } from '../../hooks/useTotal'

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
                {key === 'deliveryFee' ? ` (${distance} m)` : null}
              </dt>
              <dd className={styles.ItemValue}>{convertCentsToEuros(value)}</dd>
            </div>
          ))}

          {total ? (
            <div key={'total'} className={styles.Item}>
              <dt className={styles.ItemTitle} style={{ fontWeight: 700 }}>
                Total
              </dt>
              <dd className={styles.ItemValue} style={{ fontWeight: 700 }}>
                {convertCentsToEuros(total)}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {deliveryError && <p className={styles.Error}>{deliveryError}</p>}
    </section>
  )
}
