import React from 'react'
import { withRouter } from 'react-router'

const v2PW = {
  nookazon_hp_leaderboard_btf: { name: 'bottom-leaderboard', height: '90px' },
  nookazon_hp_leaderboard_btf2: { name: 'bottom-leaderboard2', height: '90px' },
  nookazon_hp_leaderboard: { name: 'top-leaderboard', height: '90px' },
  // nookazon_hp_mobile_btf: 'bottom-leaderboard',
  // nookazon_hp_mobile: 'top-leaderboard',
  nookazon_itm_leaderboard_btf: { name: 'bottom-leaderboard', height: '90px' },
  nookazon_itm_leaderboard: { name: 'top-leaderboard', height: '90px' },
  // nookazon_itm_mobile_btf: 'bottom-leaderboard',
  // nookazon_itm_mobile: 'top-leaderboard',
  nookazon_itm_mpu: { name: 'top-med-rect', width: '300px' },
  nookazon_list_leaderboard_btf: { name: 'bottom-leaderboard', height: '90px' },
  nookazon_list_leaderboard: { name: 'top-leaderboard', height: '90px' },
  // nookazon_list_mobile_btf: 'bottom-leaderboard',
  // nookazon_list_mobile: 'top-leaderboard',
  nookazon_list_mpu: { name: 'top-med-rect', height: '250px', width: '300px' },
  nookazon_rich_media: { name: 'bottom_rail' },
  nookazon_video: { name: 'trendi_video' },
}

const v2PWMobile = {
  nookazon_hp_leaderboard_btf: { name: 'bottom-leaderboard', height: '90px' },
  nookazon_hp_leaderboard_btf2: { name: 'bottom-leaderboard2', height: '90px' },
  nookazon_hp_leaderboard: { name: 'top-leaderboard', height: '90px' },
  nookazon_itm_leaderboard_btf: { name: 'bottom-leaderboard', height: '90px' },
  nookazon_itm_leaderboard: { name: 'top-leaderboard', height: '90px' },
  nookazon_itm_mpu: { name: 'top-med-rect', width: '300px' },
  nookazon_list_leaderboard_btf: { name: 'bottom-leaderboard', height: '90px' },
  nookazon_list_leaderboard: { name: 'top-leaderboard', height: '90px' },
  nookazon_list_mpu: { name: 'top-med-rect', height: '250px', width: '300px' },
  nookazon_rich_media: { name: 'bottom_rail' },
  nookazon_video: { name: 'trendi_video' },
  nookazon_itm_mobile: { name: 'top-leaderboard', height: '90px' },
  nookazon_itm_mobile_btf: { name: 'bottom-leaderboard', height: '90px' },
  nookazon_list_mobile: { name: 'top-leaderboard', height: '90px' },
}

const pwUnits = [
  { selectorId: 'trendi_video', type: 'trendi_video' },
  { selectorId: 'bottom_rail', type: 'bottom_rail' },
  { selectorId: 'top-leaderboard', type: 'leaderboard_atf' },
  { selectorId: 'bottom-leaderboard', type: 'leaderboard_btf' },
  { selectorId: 'bottom-leaderboard2', type: 'leaderboard_btf' },
  { selectorId: 'top-med-rect', type: 'med_rect_atf' },
  { selectorId: 'bottom-med-rect', type: 'med_rect_btf' },
]

class AdSlot extends React.Component {
  componentDidMount = () => {
    if (this.isActive()) this.defineSlot()
    window.addEventListener('beforeunload', this.destroySlots)
  }

  componentDidUpdate = (prev) => {
    let { location, name } = this.props
    if (
      this.isActive() &&
      (location.pathname !== prev.location.pathname ||
        location.search !== prev.location.search)
    ) {
      if (!name.includes('_btf')) this.destroySlots()
      this.defineSlot()
    }
  }

  componentWillUnmount = () => {
    if (this.isActive()) this.destroySlots()
    window.removeEventListener('beforeunload', this.destroySlots)
  }

  getUnit = () => {
    const adTable = this.props.mobile ? v2PWMobile : v2PW

    return pwUnits.find(
      (u) =>
        u.selectorId &&
        adTable[this.props.name] &&
        u.selectorId === adTable[this.props.name].name
    )
  }

  defineSlot = () => {
    if (window.tyche && window.tyche.addUnits) {
      const unit = this.getUnit()
      if (unit)
        window.tyche
          .addUnits([unit])
          .then(() => {
            window.tyche.displayUnits()
          })
          .catch((e) => {
            window.tyche.displayUnits()
          })
    }
  }

  destroySlots = () => {
    if (window.tyche && window.tyche.destroyUnits) {
      const unit = this.getUnit()
      if (unit) {
        const ads = window.tyche.getUnits()
        const toDestroy = []
        ads.forEach((ad) => {
          if (ad && ad.includes(unit.type)) toDestroy.push(ad)
        })
        window.tyche.destroyUnits(toDestroy)
      }
      // window.tyche.destroyUnits('all')
    }
  }

  isActive = () => {
    const { name, mobile } = this.props
    if (!mobile) return true
    return (
      name === 'nookazon_rich_media' ||
      (window.innerWidth < 600 && name.includes('mobile')) ||
      (window.innerWidth > 600 && !name.includes('mobile'))
    )
  }

  render() {
    if (!this.isActive()) return null

    const { name, mobile } = this.props

    const adTable = mobile ? v2PWMobile : v2PW

    let id = adTable[name] && adTable[name].name
    if (!id) return null

    return <div id={id} />
  }
}

export default withRouter(AdSlot)
