import { Input } from '@components/UIElements/Input'
import useAppStore from '@lib/store'
import type { FC } from 'react'
import React from 'react'
import type { TokenGatingCondition } from 'utils'

type Props = {
  condition: TokenGatingCondition
  position: number
}

const OwnsNFT: FC<Props> = ({ condition, position }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  return (
    <div>
      <div className="flex items-center mb-1 space-x-1.5">
        <div className="text-xs font-semibold opacity-70">Select a channel</div>
      </div>
      <div className="relative">
        <Input
          onChange={(event) => {}}
          placeholder="contract address"
          value={condition.owns.contractAddress}
        />
        <Input
          onChange={(event) => {}}
          placeholder="token id"
          value={condition.owns.contractAddress}
        />
      </div>
    </div>
  )
}

export default OwnsNFT
