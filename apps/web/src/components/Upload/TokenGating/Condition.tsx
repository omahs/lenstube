import { Input } from '@components/UIElements/Input'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { Dispatch, FC } from 'react'
import React from 'react'
import type { TokenGatingCondition } from 'utils'

import CollectedPosts from './CollectedPosts'
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

  return (
    <div>
      <div className="border p-3 dark:border-gray-700 space-y-2 rounded-xl">
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
            follows
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
        <div className="space-y-2">
          {condition.collected.selected && (
            <CollectedPosts condition={condition} position={position} />
          )}
          {condition.follows.selected && (
            <SubscribedChannels condition={condition} position={position} />
          )}
          {condition.owns.selected && <Input />}
        </div>
      </div>
      <button
        type="button"
        onClick={() => {}}
        className="text-center bg-opacity-70 w-full hover:bg-opacity-100 mt-2 px-4 py-2 text-sm focus:outline-none dark:bg-gray-900 bg-gray-100 rounded-full"
      >
        +
      </button>
    </div>
  )
}

export default Condition
