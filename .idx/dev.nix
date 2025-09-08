{ pkgs, ... }: {
  channel = "stable-25.05";

  packages = [ pkgs.nodejs_20 ];

  env = {
    EXPO_USE_FAST_RESOLVER = "1";
  };

  idx = {
    extensions = [
      "msjsdiag.vscode-react-native"
    ];

    workspace = {
      onCreate = {
        install = "npm ci --prefer-offline --no-audit --no-progress --timing";
      };
      onStart = {
        web = "npx expo start --web";
      };
    };

    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npx" "expo" "start" "--web" "--port" "$PORT" ];
          manager = "web";
        };
      };
    };
  };
}
