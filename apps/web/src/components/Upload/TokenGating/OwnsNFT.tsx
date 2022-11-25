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
    <div className="space-y-2">
      <div>
        <select
          autoComplete="off"
          className="bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-300 dark:border-gray-700 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full"
        >
          <option value="80001">Polygon</option>
          <option value="1">Ethereum</option>
        </select>
      </div>
      <div>
        <Input
          onChange={(event) => {}}
          placeholder="contract address"
          value={condition.owns.contractAddress}
        />
      </div>
      <div>
        <Input
          onChange={(event) => {}}
          placeholder="token id (optional)"
          value={condition.owns.contractAddress}
        />
      </div>
    </div>
  )
}

export default OwnsNFT
