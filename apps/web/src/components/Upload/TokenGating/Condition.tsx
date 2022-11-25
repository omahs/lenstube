import TimesOutline from '@components/Common/Icons/TimesOutline'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { Dispatch, FC } from 'react'
import React from 'react'
import type { TokenGatingCondition } from 'utils'

import CollectedPosts from './CollectedPosts'
import OwnsNFT from './OwnsNFT'
import SubscribedChannels from './SubscribedChannels'

type Props = {
  condition: TokenGatingCondition
  setShowModal: Dispatch<boolean>
  position: number
}

const Condition: FC<Props> = ({ condition, position, setShowModal }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const setCondition = (data: TokenGatingCondition) => {
    const conditions = uploadedVideo.tokenGating.accessConditions
    conditions[position] = {
      ...conditions[position],
      ...data
    }
    setUploadedVideo({
      ...uploadedVideo,
      tokenGating: {
        ...uploadedVideo.tokenGating,
        accessConditions: conditions
      }
    })
  }

  const onRemoveCondition = () => {
    const accessConditions = uploadedVideo.tokenGating.accessConditions
    accessConditions.splice(position, 1)
    setUploadedVideo({
      ...uploadedVideo,
      tokenGating: {
        ...uploadedVideo.tokenGating,
        accessConditions
      }
    })
  }

  return (
    <div className="border relative p-3 dark:border-gray-700 space-y-2 rounded-xl">
      <button
        type="button"
        onClick={() => onRemoveCondition()}
        className="absolute -top-1 -right-1 focus:outline-none rounded-xl bg-white dark:bg-black"
      >
        <TimesOutline className="w-4 h-4 text-red-500" />
      </button>
      <div className="grid gap-3 grid-cols-3">
        <button
          type="button"
          onClick={() =>
            setCondition({
              collected: { selected: true },
              follows: { selected: false },
              owns: { selected: false }
            })
          }
          className={clsx(
            'text-center px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              '!border-indigo-500': condition.collected.selected
            }
          )}
        >
          collected
        </button>
        <button
          type="button"
          onClick={() =>
            setCondition({
              collected: { selected: false },
              follows: { selected: true },
              owns: { selected: false }
            })
          }
          className={clsx(
            'text-center px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              '!border-indigo-500': condition.follows.selected
            }
          )}
        >
          subscribed
        </button>
        <button
          type="button"
          onClick={() =>
            setCondition({
              collected: { selected: false },
              follows: { selected: false },
              owns: { selected: true }
            })
          }
          className={clsx(
            'text-center px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              '!border-indigo-500': condition.owns.selected
            }
          )}
        >
          owns an NFT
        </button>
      </div>
      <div>
        {condition.collected.selected && (
          <CollectedPosts condition={condition} position={position} />
        )}
        {condition.follows.selected && (
          <SubscribedChannels condition={condition} position={position} />
        )}
        {condition.owns.selected && (
          <OwnsNFT condition={condition} position={position} />
        )}
      </div>
    </div>
  )
}

export default Condition
