---
order: 1
---

# How to run a Python script

Kestra has a build-in [Python task](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.html) that can run any Python script.

The default behavior is to run any Python script in a specific virtual environment. Hence, you can provide a `requirements.txt` to the task definition to install any library at runtime.

Here is a simple example where we use the `requests` librairy to submit a HTTP request.

```yaml
id: test-python
namespace: test

tasks:
  - id: run_python
    type: io.kestra.core.tasks.scripts.Python
    requirements:
      - requests
    inputFiles:
      main.py: |
        from kestra import Kestra
        import requests

        response = requests.get("https://google.com")
        Kestra.outputs({"data": response.text})
```

However, installing libraries at runtime is not always very efficient. Fortunetely, Kestra supports Docker :

```yaml
id: test-python
namespace: test

tasks:
  - id: run_python
    type: io.kestra.core.tasks.scripts.Python
    virtualEnv: false
      commands:
        - python main.py
      runner: DOCKER
      dockerOptions:
        image: custom_python
        pullImage: false
    inputFiles:
      main.py: |
        from kestra import Kestra
        import requests

        response = requests.get("https://google.com")
        Kestra.outputs({"data": response.text})
```

In the example above we set `runner : DOCKER` and `virtualEnv: false` to declare that we want to run a Docker container without any virtual environment setup. In this case, the task will run `python main.py` as specified by the `commands` property.

In the `dockerOptions` we specify the image we want to run. When `pullImage` is `false` Kestra will look at local Docker images, but when set to `true` you will be able to pull images from any Docker registry. You can find more details in the [`dockerOptions` specificications](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.python#dockeroptions-1).


One great feature of Kestra YAML declarative language is the `taskDefault` property. Setting up all the Docker properties in all our flows could end-up in heavy copy-pasted configurations. Thanks to `taskDefault` property we can write those in one place.

You can set `taskDefault` at the [Flow](docs/concepts/flows.md) level or even in [Kestra configuration](docs/administrator-guide/configuration/others/README.md).

Here is our previous Flow with the taskDefault property:


```yaml
id: test-python
namespace: test

tasks:

  - id: run_python
    type: io.kestra.core.tasks.scripts.Python
    requirements:
      - requests
    inputFiles:
      main.py: |
        from kestra import Kestra
        import requests

        response = requests.get("https://google.com")
        Kestra.outputs({"data": response.text})

taskDefaults:
  - type: io.kestra.core.tasks.scripts.Python
    values:
      virtualEnv: false
      commands:
        - python main.py
      runner: DOCKER
      dockerOptions:
        image: custom_python
        pullImage: false
```