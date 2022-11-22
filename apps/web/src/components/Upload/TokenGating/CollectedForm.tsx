import { Button } from '@components/UIElements/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import type { Erc20 } from 'lens'
import type { Dispatch, FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TokenGatingType, UploadedVideo } from 'utils'
import { WMATIC_TOKEN_ADDRESS } from 'utils'
import { z } from 'zod'

import PostList from './PostList'

type Props = {
  uploadedVideo: UploadedVideo
  setTokenGatingType: (data: TokenGatingType) => void
  setShowModal: Dispatch<boolean>
}

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().min(1, { message: 'Invalid amount' }),
  collectLimit: z.string().min(1, { message: 'Invalid collect limit' }),
  referralPercent: z
    .number()
    .max(100, { message: 'Percentage should be 0 to 100' })
    .nonnegative({ message: 'Should to greater than or equal to zero' })
})
export type FormData = z.infer<typeof formSchema>

const CollectedForm: FC<Props> = ({
  uploadedVideo,
  setTokenGatingType,
  setShowModal
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    unregister,
    setError
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralPercent: Number(uploadedVideo.collectModule.referralFee || 0),
      currency:
        uploadedVideo.collectModule.amount?.currency ?? WMATIC_TOKEN_ADDRESS,
      amount: uploadedVideo.collectModule.amount?.value,
      collectLimit: uploadedVideo.collectModule.collectLimit || '1'
    }
  })
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('WMATIC')

  useEffect(() => {
    if (
      uploadedVideo.collectModule.isLimitedFeeCollect ||
      uploadedVideo.collectModule.isLimitedTimeFeeCollect
    ) {
      register('collectLimit')
    } else {
      unregister('collectLimit')
    }
  }, [uploadedVideo.collectModule, register, unregister])

  const getCurrencySymbol = (currencies: Erc20[], address: string) => {
    return currencies.find((c) => c.address === address)?.symbol as string
  }

  const onSubmit = (data: FormData) => {
    const amount = Number(data.amount)
    if (amount === 0) {
      return setError('amount', { message: 'Amount should be greater than 0' })
    }
    if (Number(data.collectLimit) === 0) {
      return setError('collectLimit', {
        message: 'Collect limit should be greater than 0'
      })
    }
    // setCollectType({
    //   amount: {
    //     currency: data.currency,
    //     value: amount.toString()
    //   },
    //   referralFee: data.referralPercent,
    //   recipient: selectedChannel?.ownedBy,
    //   collectLimit: data.collectLimit
    // })
    setShowModal(false)
  }

  return (
    <form className="space-y-3">
      <PostList />

      <div className="flex justify-end">
        <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
          Set Collect Type
        </Button>
      </div>
    </form>
  )
}

export default CollectedForm
