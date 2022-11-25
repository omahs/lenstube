import CheckOutline from '@components/Common/Icons/CheckOutline'
import PlusOutline from '@components/Common/Icons/PlusOutline'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore, { TOKEN_GATING_ACCESS_CONDITION } from '@lib/store'
import clsx from 'clsx'
import React, { useState } from 'react'
import type { TokenGatingType } from 'utils'
import { useProvider, useSigner } from 'wagmi'

import Condition from './Condition'

const TokenGating = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  console.log(
    '🚀 ~ file: index.tsx ~ line 15 ~ TokenGating ~ uploadedVideo',
    uploadedVideo.tokenGating
  )
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const getTokenGatingInstance = useAppStore(
    (state) => state.getTokenGatingInstance
  )

  const { data: signer } = useSigner()
  const provider = useProvider()

  const initTokenGating = async () => {
    if (!signer || uploadedVideo.tokenGating.instance) return
    const gatedSdk = await getTokenGatingInstance(signer, provider)
    setUploadedVideo({
      ...uploadedVideo,
      tokenGating: { ...uploadedVideo.tokenGating, instance: gatedSdk }
    })
  }

  const getSelectedTokenGatingType = () => {
    const isAccessRestricted = uploadedVideo?.tokenGating?.isAccessRestricted
    if (!isAccessRestricted) {
      return 'Everyone can view'
    } else {
      return 'Only certain audience can view'
    }
  }

  const setTokenGatingType = (data: TokenGatingType) => {
    setUploadedVideo({
      ...uploadedVideo,
      tokenGating: { ...uploadedVideo.tokenGating, ...data }
    })
  }

  const onAddCondition = () => {
    setUploadedVideo({
      ...uploadedVideo,
      tokenGating: {
        ...uploadedVideo.tokenGating,
        accessConditions: [
          ...uploadedVideo.tokenGating.accessConditions,
          TOKEN_GATING_ACCESS_CONDITION
        ]
      }
    })
  }

  return (
    <>
      <div className="flex items-center mb-1 space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          Token Gated Access
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setShowModal(true)
          initTokenGating()
        }}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-300 focus:outline-none dark:border-gray-700 rounded-xl"
      >
        <span>{getSelectedTokenGatingType()}</span>
        <CheckOutline className="w-3 h-3" />
      </button>
      <Modal
        title="Who can view your video?"
        panelClassName="max-w-lg max-h-[80%] overflow-y-auto no-scrollbar"
        show={showModal}
      >
        <div className="mt-2 space-y-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                setTokenGatingType({
                  isAccessRestricted: false,
                  accessConditions: uploadedVideo.tokenGating.accessConditions
                })
              }
              className={clsx(
                'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
                {
                  '!border-indigo-500':
                    !uploadedVideo.tokenGating.isAccessRestricted
                }
              )}
            >
              <span>Everyone</span>
              {!uploadedVideo?.tokenGating.isAccessRestricted && (
                <CheckOutline className="w-3 h-3" />
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                setTokenGatingType({
                  isAccessRestricted: true,
                  accessConditions: uploadedVideo.tokenGating.accessConditions
                })
              }
              className={clsx(
                'flex items-center text-left justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
                {
                  '!border-indigo-500':
                    uploadedVideo.tokenGating.isAccessRestricted
                }
              )}
            >
              <span>Certain Audience (who)</span>
              {uploadedVideo?.tokenGating.isAccessRestricted && (
                <CheckOutline className="w-3 h-3" />
              )}
            </button>
          </div>
          {uploadedVideo.tokenGating.isAccessRestricted ? (
            <>
              {uploadedVideo.tokenGating.accessConditions?.map(
                (condition, i) => (
                  <Condition
                    key={i}
                    position={i}
                    condition={condition}
                    setShowModal={setShowModal}
                  />
                )
              )}
              {uploadedVideo.tokenGating.accessConditions.length < 5 && (
                <button
                  type="button"
                  onClick={() => onAddCondition()}
                  className="justify-center space-x-2 items-center mx-auto flex bg-opacity-70 hover:bg-opacity-100 mt-2 py-2 px-3 text-sm focus:outline-none dark:bg-gray-900 bg-gray-100 rounded-full"
                >
                  <span className="font-medium">AND</span>
                  <PlusOutline className="w-4 h-4" />
                </button>
              )}
            </>
          ) : null}
          <div className="flex justify-end">
            <Button type="button" onClick={() => setShowModal(false)}>
              Set Preference
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TokenGating
