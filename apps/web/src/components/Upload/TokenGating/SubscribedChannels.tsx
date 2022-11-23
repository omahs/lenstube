import TimesOutline from '@components/Common/Icons/TimesOutline'
import Channels from '@components/Common/Search/Channels'
import { Input } from '@components/UIElements/Input'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { Profile } from 'lens'
import { SearchRequestTypes, useSearchProfilesLazyQuery } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { TokenGatingCondition } from 'utils'
import { Analytics, TRACK } from 'utils'
import useDebounce from 'utils/hooks/useDebounce'

type Props = {
  condition: TokenGatingCondition
  position: number
}

const SubscribedChannels: FC<Props> = ({ condition, position }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce<string>(keyword, 500)

  const [searchChannels, { data, loading }] = useSearchProfilesLazyQuery()

  const onDebounce = () => {
    if (keyword.trim().length) {
      searchChannels({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query: keyword,
            limit: 2
          }
        }
      })
      Analytics.track(TRACK.SEARCH_CHANNELS)
    }
  }

  const channels =
    data?.search?.__typename === 'ProfileSearchResult'
      ? data?.search?.items
      : []

  const onSelectChannel = (profileId: string, handle: string) => {
    const conditions = uploadedVideo.tokenGating.accessConditions
    conditions[position] = {
      ...conditions[position],
      follows: { profileId, handle, selected: true }
    }
    setUploadedVideo({
      ...uploadedVideo,
      tokenGating: {
        ...uploadedVideo.tokenGating,
        accessConditions: conditions
      }
    })
  }

  useEffect(() => {
    onDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const clearSearch = () => {
    setKeyword('')
  }

  return (
    <div>
      {!condition.follows.handle ? (
        <>
          <div className="flex items-center mb-1 space-x-1.5">
            <div className="text-xs font-semibold opacity-70">
              Select a channel
            </div>
          </div>
          <div className="relative">
            <Input
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="search channels"
              value={keyword}
            />
            <div
              className={clsx(
                'md:absolute w-full mt-1 text-base bg-white overflow-hidden dark:bg-theme rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                { hidden: debouncedValue.length === 0 }
              )}
            >
              {data?.search?.__typename === 'ProfileSearchResult' && (
                <Channels
                  linked={false}
                  onSelect={(id, handle) => onSelectChannel(id, handle)}
                  results={channels as Profile[]}
                  loading={loading}
                  clearSearch={clearSearch}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <span className="bg-gray-200 inline-flex space-x-1.5 items-center dark:bg-gray-800 px-2 py-0.5 text-sm rounded-xl">
          <span>{condition.follows.handle}</span>
          <button onClick={() => onSelectChannel('', '')} type="button">
            <TimesOutline className="w-3 h-3" />
          </button>
        </span>
      )}
    </div>
  )
}

export default SubscribedChannels
