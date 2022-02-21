import React from 'react'
import { withRouter } from 'react-router'

// const types = [
//   'trendi_video',
//   'bottom_rail',
//   'leaderboard_atf',
//   'leaderboard_btf',
//   'med_rect_btf',
// ]

// const pwUnits = [
//   { selectorId: 'trendi_video', type: 'trendi_video' },
//   { selectorId: 'bottom_rail', type: 'bottom_rail' },
//   { selectorId: 'top-leaderboard', type: 'leaderboard_atf' },
//   { selectorId: 'bottom-leaderboard', type: 'leaderboard_btf' },
//   { selectorId: 'bottom-leaderboard2', type: 'leaderboard_btf' },
//   { selectorId: 'top-med-rect', type: 'med_rect_atf' },
//   { selectorId: 'bottom-med-rect', type: 'med_rect_btf' },
// ]

class AdSlot extends React.Component {
  componentDidMount = () => {
    if (this.isActive()) this.defineSlot()
    window.addEventListener('beforeunload', this.destroySlots)
  }

  componentDidUpdate = (prev) => {
    const { location } = this.props
    if (
      this.isActive() &&
      (location.pathname !== prev.location.pathname ||
        location.search !== prev.location.search)
    ) {
      this.destroySlots()
      this.defineSlot()
    }
  }

  componentWillUnmount = () => {
    if (this.isActive()) this.destroySlots()
    window.removeEventListener('beforeunload', this.destroySlots)
  }

  getId = () => {
    const { name } = this.props
    return name
  }

  getUnit = () => {
    return { selectorId: this.getId(), type: this.props.type }
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
    let id = this.getId()
    if (!id) return null
    return <div id={id} />
  }
}

export default withRouter(AdSlot)
