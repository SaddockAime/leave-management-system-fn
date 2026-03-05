# andasy.hcl app configuration file generated for hr-employees-management-fn on Thursday, 05-Mar-26 12:03:54 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "hr-employees-management-fn"

app {

  env = {}

  port = 3000

  primary_region = "kgl"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "hr-employees-management-fn"
  }

}
