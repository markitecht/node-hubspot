const qs = require('querystring')

class OAuth {
  constructor(client) {
    this.client = client
  }

  getAuthorizationUrl(data) {
    const newParams = {
      client_id: this.client.clientId,
      redirect_uri: this.client.redirectUri,
    }
    const params = Object.assign({}, data, newParams)
    return 'https://app.hubspot.com/oauth/authorize?' + qs.stringify(params)
  }

  getAccessToken(data) {
    const newData = {
      grant_type: 'authorization_code',
      client_id: this.client.clientId,
      client_secret: this.client.clientSecret,
      redirect_uri: this.client.redirectUri,
    }
    const form = Object.assign({}, data, newData)

    return this.client._request({
      method: 'POST',
      path: '/oauth/v1/token',
      form,
    })
  }

  refreshAccessToken(data) {
    const newData = {
      grant_type: 'refresh_token',
      client_id: this.client.clientId,
      client_secret: this.client.clientSecret,
      redirect_uri: this.client.redirectUri,
      refresh_token: this.client.refreshToken,
    }
    const form = Object.assign({}, data, newData)

    return this.client
      ._request({
        method: 'POST',
        path: '/oauth/v1/token',
        form,
      })
      .then(results => {
        this.client.setAccessToken(results.access_token) // refresh the new access_token on the client
        return results
      })
  }

  getPortalInfo() {
    return this.client._request({
      method: 'GET',
      path: `/oauth/v1/access-tokens/${this.client.accessToken}`
    })
  }
}

module.exports = OAuth
